defmodule Backend.Socket.Websocket do
  alias Backend.Schema
  require Logger
  import Jason.Helpers, only: [json_map: 1]
  import Ecto.Query, only: [from: 2]

  # https://ninenines.eu/docs/en/cowboy/2.6/manual/cowboy_websocket
  @behaviour :cowboy_websocket

  @impl :cowboy_websocket
  def init(request, state) do
    {:cowboy_websocket, request, state}
  end

  @impl :cowboy_websocket
  def websocket_init(state) do
    # assign the logger metadata from the Plug process
    %{
      logger_metadata: logger_metadata,
      session: session
    } = state

    Logger.metadata(logger_metadata)
    Backend.Socket.Agent.add(session.id, self())

    state = Map.delete(state, :logger_metadata)

    Logger.debug("new websocket connection")

    json_map(type: "searching")
    |> reply_json(state)
  end

  @impl :cowboy_websocket
  def websocket_handle({:text, text}, state) do
    case Jason.decode(text) do
      {:ok, json} ->
        Backend.Socket.Handler.handle_message(json, state)

      {:error, %Jason.DecodeError{position: pos}} ->
        json_map(error: "Error parsing JSON at position #{pos}")
        |> reply_json(state)
    end
  end

  @impl :cowboy_websocket
  def websocket_handle(frame, state) do
    Logger.debug(unhandled_websocket_frame: frame)
    {:ok, state}
  end

  @impl :cowboy_websocket
  def websocket_info(info, state) do
    Backend.Socket.Handler.handle_info(info, state)
  end

  @impl :cowboy_websocket
  def terminate(reason, _partial_req, state) do
    case reason do
      :normal ->
        :ok

      _ ->
        Logger.debug(websocket_terminated: reason)
    end

    session = state.session
    Backend.Socket.Agent.remove(session.id)

    room = state[:room]

    if room != nil do
      Backend.Room.Agent.leave_room(room, session.id)
    end

    Backend.Repo.delete_all(
      from(
        q in Schema.Queuing,
        where: q.id == ^session.id
      )
    )

    :ok
  end

  defp reply_text(text, state) do
    {:reply, {:text, text}, state}
  end

  defp reply_json(map, state) do
    map
    |> Jason.encode!()
    |> reply_text(state)
  end
end
