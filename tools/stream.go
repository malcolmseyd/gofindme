// streams stdin over HTTP
// we use this for sharing container stdout during development like so:
// $ docker logs -f -n 0 CONTAINER | PORT=123 PASSWORD=abc ./stream
package main

import (
	"crypto/subtle"
	"errors"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"time"
)

func mustEnv(key string) string {
	val, ok := os.LookupEnv(key)
	if !ok {
		log.Fatalln("missing env:", key)
	}
	return val
}

var port = mustEnv("PORT")
var password = mustEnv("PASSWORD")

func main() {
	host := net.JoinHostPort("localhost", port)
	log.Printf("listening at http://%s/?password=%s", host, password)

	// our interface to stdin
	add_stream := make(chan chan []byte, 16)
	remove_stream := make(chan chan []byte, 16)

	// fan out stdin to all clients
	go func() {
		clients := make(map[chan []byte]struct{})
		for {
		RecvLoop:
			// receive all messages and block until we have clients
			for {
				select {
				case clientChan := <-add_stream:
					clients[clientChan] = struct{}{}

				case clientChan := <-remove_stream:
					delete(clients, clientChan)
					close(clientChan)

				default:
					if len(clients) != 0 {
						break RecvLoop
					}
					// we don't want to busy wait
					time.Sleep(time.Millisecond * 20)
				}

			}

			// read into buffer
			buf := make([]byte, 4096)
			n, err := os.Stdin.Read(buf)
			if errors.Is(err, io.EOF) {
				for c := range clients {
					close(c)
				}

				return
			} else if err != nil {
				log.Println("failed to read:", err)
				return
			}

			// fan out to clients
			for c := range clients {
				if len(c) < cap(c) {
					c <- buf[:n]
				}
			}
		}
	}()

	err := http.ListenAndServe(host, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// super basic auth
		q := r.URL.Query().Get("password")
		if subtle.ConstantTimeCompare([]byte(q), []byte(password)) != 0 {
			w.WriteHeader(http.StatusUnauthorized)
			io.WriteString(w, "unauthorized")
			return
		}

		// make sure the connection is flushable
		f, ok := w.(http.Flusher)
		if !ok {
			return
		}

		// add our magic streaming headers
		w.Header().Add("Content-Type", "text/plain; charset=UTF-8")
		w.Header().Add("X-Content-Type-Options", "nosniff")
		w.Header().Add("Transfer-Encoding", "chunked")

		// connect to stdin
		stream := make(chan []byte, 1)
		add_stream <- stream

		// feed stdin stream chunks into the HTTP response
		for {
			var err error
			select {
			case buf := <-stream:
				_, err = w.Write(buf)
			case <-time.After(10 * time.Second):
				// keepalive
				_, err = w.Write(nil)
			}
			if err != nil {
				log.Println("failed to write:", err)
				remove_stream <- stream
				return
			}
			// flush so the client gets data ASAP
			f.Flush()
		}
	}))
	if err != nil {
		log.Fatalln("listener failed with error")
	}
}
