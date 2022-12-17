defmodule Backend.Mock.Router do
  use Plug.Router

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  )

  plug(:match)
  plug(:dispatch)

  get "/start" do
    session_token =
      :rand.bytes(8)
      |> :base64.encode_to_string()
      |> to_string()

    resp = Jason.encode!(%{session: session_token})

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, resp)
  end

  match("/socket", to: Backend.Mock.Socket)

  match _ do
    send_resp(conn, 404, "404: Not found")
  end
end
