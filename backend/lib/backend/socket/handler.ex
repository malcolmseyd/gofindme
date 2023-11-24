defmodule Backend.Socket.Handler do
  require Logger
  import Jason.Helpers, only: [json_map: 1]

  alias Backend.Repo
  alias Backend.Room
  alias Backend.Schema

  def handle_message(%{"type" => "chat", "msg" => msg}, state) do
    session = state.session
    room = state[:room]

    if room do
      Room.Agent.broadcast_chat(room, session.id, msg)
    end

    {:ok, state}
  end

  def handle_message(%{"type" => "keep_alive"}, state) do
    Logger.debug(msg: "keep_alive")
    {:ok, state}
  end

  def handle_message(
        %{"type" => "location_update", "lat" => lat, "long" => long},
        state
      ) do
    Logger.debug(msg: "location_update", lat: lat, long: long)

    session = state.session
    room = state[:room]

    if room do
      Room.Agent.broadcast_location(room, session.id, {lat, long})
    else
      %{latitude: lat, longitude: long, session_id: session.id}
      |> Schema.Queuing.create_changeset()
      |> Repo.insert_or_update!(
        conflict_target: [:session_id],
        on_conflict: {:replace, [:latitude, :longitude]}
      )
    end

    {:ok, state}
  end

  def handle_message(msg, state) do
    Logger.debug(unhandled_msg: msg)
    {:ok, state}
  end

  def handle_info({:paired, room, session_id}, state) do
    state = Map.put(state, :room, room)
    user = Backend.Repo.get!(Backend.Schema.Session, session_id)

    json_map(type: "paired", name: user.name)
    |> reply_json(state)
  end

  def handle_info({:location, from_id, {lat, long}}, state) do
    if from_id !== state.session.id do
      json_map(type: "location_update", lat: lat, long: long)
      |> reply_json(state)
    else
      {:ok, state}
    end
  end

  def handle_info({:chat, from_id, {message, sent}}, state) do
    if from_id !== state.session.id do
      json_map(type: "chat", msg: message, sent: sent)
      |> reply_json(state)
    else
      {:ok, state}
    end
  end

  def handle_info(info, state) do
    Logger.debug(unhandled_websocket_info: info)
    {:ok, state}
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
