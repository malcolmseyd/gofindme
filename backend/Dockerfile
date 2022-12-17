FROM elixir:1.14-alpine as builder

COPY mix.exs mix.lock /app/
COPY lib/ /app/lib/

WORKDIR /app

ENV MIX_ENV=prod

# install package managers
RUN mix local.hex --force
RUN mix local.rebar --force

# install dependencies
RUN mix deps.get

# install app
RUN mix release

# runtime image
FROM elixir:1.14-alpine
COPY --from=builder /app/_build/prod/rel/backend/ /

CMD backend start
