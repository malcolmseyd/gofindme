defmodule Backend.Router do
  require Logger
  use Plug.Router
  alias Backend.Schema
  alias Backend.Repo

  plug(Plug.RequestId)
  plug(Plug.Logger)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  )

  plug(:match)
  plug(:dispatch)

  post "/start" do
    with {:ok, session} <-
           conn.body_params
           |> Schema.Session.create_changeset()
           |> Repo.insert(returning: [:token]) do
      conn
      |> put_resp_cookie("session", session.token)
      |> send_resp(200, "ok")
    else
      :error ->
        conn
        |> send_resp(400, "bad request")
    end
  end

  match("/socket", to: Backend.Socket)

  forward("/mock", to: Backend.Mock.Router)

  match _ do
    send_resp(conn, 404, "404: Not found")
  end
end
