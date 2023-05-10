import Config

config :backend, Backend.Repo,
  url: System.get_env("DB_URL"),
  hostname: System.get_env("DB_HOST", ""),
  ssl: true,
  ssl_opts: [
    verify: :verify_peer,
    cacertfile: "/etc/ssl/certs/ca-certificates.crt",
    server_name_indication: String.to_charlist(System.get_env("DB_HOST", "")),
    customize_hostname_check: [match_fun: :public_key.pkix_verify_hostname_match_fun(:https)],
    depth: 3
    # verify_fun:
    #   {&:ssl_verify_hostname.verify_fun/3,
    #    [check_hostname: String.to_charlist(System.get_env("DB_HOST", ""))]}
  ]
