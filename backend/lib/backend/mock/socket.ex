defmodule Backend.Mock.Socket do
  require Logger
  import Plug.Conn

  def init(opts) do
    opts
  end

  def call(conn, _opts) do
    conn = conn |> fetch_cookies()

    # TODO use Ecto for validation
    with {:ok, session} <- conn.cookies |> Map.fetch("session") do
      Logger.metadata(session: session |> to_charlist |> :base64.decode())

      handler_opts = %{
        # move logger metadata across process boundaries
        logger_metadata: Logger.metadata()
      }

      # https://ninenines.eu/docs/en/cowboy/2.6/manual/cowboy_websocket/#_opts
      conn_opts = %{compress: true}

      # https://hexdocs.pm/plug_cowboy/Plug.Cowboy.html#module-websocket-support
      details = {Backend.Mock.SocketHandler, handler_opts, conn_opts}
      upgrade_adapter(conn, :websocket, details)
    else
      :error ->
        conn
        |> resp(403, "unauthorized")
    end
  end
end
