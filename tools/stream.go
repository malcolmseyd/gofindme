// streams stdin over HTTP
// we use this for sharing container stdout during development like so:
// $ docker logs -f -n 0 CONTAINER | PORT=123 PASSWORD=abc ./stream
package main

import (
	"io"
	"log"
	"net"
	"net/http"
	"os"
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

	err := http.ListenAndServe(host, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query().Get("password")
		if q != password {
			w.WriteHeader(http.StatusUnauthorized)
			io.WriteString(w, "unauthorized")
			return
		}
		f, ok := w.(http.Flusher)
		if !ok {
			return
		}
		w.Header().Add("Content-Type", "text/plain; charset=UTF-8")
		w.Header().Add("X-Content-Type-Options", "nosniff")
		w.Header().Add("Transfer-Encoding", "chunked")

		buf := make([]byte, 4096)
		for {
			n, err := os.Stdin.Read(buf)
			if err != nil {
				log.Println("failed to read:", err)
				return
			}
			w.Write(buf[:n])
			if err != nil {
				log.Println("failed to write:", err)
				return
			}
			f.Flush()
		}
	}))
	if err != nil {
		log.Fatalln("listener failed with error")
	}
}
