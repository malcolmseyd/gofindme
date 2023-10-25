defmodule Backend.Socket do
  require Logger
  import Plug.Conn
  import Ecto.Query, only: [from: 2]

  def init(opts) do
    opts
  end

  def call(conn, _opts) do
    conn = fetch_cookies(conn)

    with %{"session" => session_id} <- conn.cookies,
         true <- session_exists?(session_id) do
      Logger.metadata(session: session_id)
      upgrade_request(conn)
    else
      _ -> resp(conn, 403, "unauthorized")
    end
  end

  defp session_exists?(session_id) do
    Backend.Repo.exists?(
      from(s in Backend.Schema.Session,
        where: s.token == type(^session_id, Ecto.UUID)
      )
    )
  rescue
    _ in Ecto.Query.CastError -> false
  end

  defp upgrade_request(conn) do
    handler_opts = %{
      # move logger metadata across process boundaries
      logger_metadata: Logger.metadata()
    }

    # https://ninenines.eu/docs/en/cowboy/2.6/manual/cowboy_websocket/#_opts
    conn_opts = %{compress: true}

    # https://hexdocs.pm/plug_cowboy/Plug.Cowboy.html#module-websocket-support
    details = {Backend.Mock.SocketHandler, handler_opts, conn_opts}
    upgrade_adapter(conn, :websocket, details)
  end
end
