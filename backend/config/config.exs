import Config

config :logger, :console, metadata: [:request_id, :session]

config :backend, ecto_repos: [Backend.Repo]
