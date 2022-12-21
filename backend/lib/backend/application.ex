defmodule Backend.Application do
  @moduledoc false

  use Application
  require Logger

  @impl true
  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: Backend.Router, options: [port: 8080]}
    ]

    opts = [strategy: :one_for_one, name: Backend.Supervisor]

    Logger.info("Starting application...")

    Supervisor.start_link(children, opts)
  end
end
