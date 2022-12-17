defmodule Backend.Router do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  forward "/mock", to: Backend.Mock.Router

  match _ do
    send_resp(conn, 404, "404: Not found")
  end
end
