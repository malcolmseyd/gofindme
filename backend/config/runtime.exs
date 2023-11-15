import Config

config :backend, Backend.Repo,
  database: System.get_env("DB_NAME"),
  username: System.get_env("DB_USER"),
  password: System.get_env("DB_PASS"),
  hostname: System.get_env("DB_HOST"),
  # postgrex was breaking with pgbouncer, can't use named prepared statements
  prepare: :unnamed,
  ssl: true,
  ssl_opts: [
    server_name_indication: to_charlist(System.get_env("DB_HOST")),
    verify: :verify_peer,
    cacertfile: "/etc/ssl/certs/ca-certificates.crt",
    customize_hostname_check: [match_fun: :public_key.pkix_verify_hostname_match_fun(:https)]
  ]
