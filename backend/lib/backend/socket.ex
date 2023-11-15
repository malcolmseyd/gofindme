defmodule Backend.Socket do
  require Logger
  import Plug.Conn

  def init(opts) do
    opts
  end

  def call(conn, _opts) do
    conn = fetch_cookies(conn)

    with %{"session" => session_id} <- conn.cookies,
         {:ok, session} <- query_session(session_id) do
      Logger.metadata(session: session_id)

      handler_opts = %{
        # move logger metadata across process boundaries
        logger_metadata: Logger.metadata(),
        session: session
      }

      # https://ninenines.eu/docs/en/cowboy/2.6/manual/cowboy_websocket/#_opts
      conn_opts = %{compress: true}

      # https://hexdocs.pm/plug_cowboy/Plug.Cowboy.html#module-websocket-support
      details = {Backend.Socket.Websocket, handler_opts, conn_opts}
      upgrade_adapter(conn, :websocket, details)
    else
      _ -> resp(conn, 403, "unauthorized")
    end
  end

  defp query_session(session_id) do
    session = Backend.Repo.get_by(Backend.Schema.Session, token: session_id)
    {:ok, session}
  rescue
    err in Ecto.Query.CastError -> {:error, err}
  end
end
