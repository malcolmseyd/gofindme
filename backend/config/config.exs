import Config

config :logger, :console,
  metadata: [:request_id]
