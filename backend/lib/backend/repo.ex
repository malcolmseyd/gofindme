defmodule Backend.Repo do
  use Ecto.Repo,
    otp_app: :backend,
    adapter: Ecto.Adapters.Postgres

  def init(_type, config) do
    config =
      if config[:verify_ssl] do
        Keyword.put(config, :ssl_opts, my_ssl_opts(config[:hostname]))
      else
        config
      end

    {:ok, config}
  end

  def my_ssl_opts(server) do
    [
      verify: :verify_peer,
      cacertfile: System.get_env("DB_CA_CERT_FILE"),
      server_name_indication: String.to_charlist(server),
      customize_hostname_check: [match_fun: :public_key.pkix_verify_hostname_match_fun(:https)],
      depth: 3
    ]
  end
end
