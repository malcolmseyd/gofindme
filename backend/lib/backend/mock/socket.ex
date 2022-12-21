defmodule Backend.Mock.Socket do
  import Plug.Conn

  def init(opts) do
    opts
  end

  def call(conn, _opts) do
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
