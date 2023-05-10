import Config

config :logger, :console, metadata: [:request_id]

config :backend, ecto_repos: [Backend.Repo]
