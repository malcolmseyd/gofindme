defmodule Backend.Room.Agent do
  use Agent, restart: :transient

  def start_link(_initial_value) do
    Agent.start_link(fn -> MapSet.new() end)
  end

  def join_room(room, user_id) do
    Agent.update(room, &MapSet.put(&1, user_id))
  end

  def leave_room(room, _user_id) do
    Agent.get(room, fn set -> set end)
    |> Enum.each(fn to_id ->
      Backend.Socket.Agent.send_info(to_id, :unpaired)
    end)

    Agent.stop(__MODULE__)
  end

  def broadcast_chat(room, from_id, message) do
    sent = DateTime.utc_now()

    Agent.get(room, fn set -> set end)
    |> Enum.each(fn to_id ->
      Backend.Socket.Agent.send_info(to_id, {:chat, from_id, {message, sent}})
    end)
  end

  def broadcast_location(room, from_id, location) do
    Agent.get(room, fn set -> set end)
    |> Enum.each(fn to_id ->
      Backend.Socket.Agent.send_info(to_id, {:location, from_id, location})
    end)
  end
end
