defmodule Backend.Mock.Router do
  require Logger
  use Plug.Router

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  )

  plug(:match)
  plug(:dispatch)

  post "/start" do
    # TODO use Ecto for validation
    with {:ok, _name} <- conn.body_params |> Map.fetch("name") do
      session_token =
        :rand.bytes(8)
        |> :base64.encode_to_string()
        |> to_string()

      conn
      |> put_resp_cookie("session", session_token)
      |> send_resp(200, "ok")
    else
      :error ->
        conn
        |> send_resp(400, "bad request")
    end
  end

  match("/socket", to: Backend.Mock.Socket)

  match _ do
    send_resp(conn, 404, "404: Not found")
  end
end
