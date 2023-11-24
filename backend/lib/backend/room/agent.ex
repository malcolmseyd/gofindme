defmodule Backend.Room.Agent do
  use Agent, restart: :transient

  def start_link(_initial_value) do
    Agent.start_link(fn -> MapSet.new() end)
  end

  def join_room(room, user_id) do
    Agent.update(room, &MapSet.put(&1, user_id))
  end

  def leave_room(room, user_id) do
    size =
      Agent.get_and_update(room, fn map ->
        map = MapSet.delete(map, user_id)
        {MapSet.size(map), map}
      end)

    if size === 0 do
      Agent.stop(__MODULE__)
    end
  end

  def broadcast_message(room, message) do
    Agent.get(room, fn set -> set end)
    |> Enum.each(fn user_id ->
      Backend.Socket.Agent.send_info(user_id, {:message, user_id, message})
    end)
  end

  def broadcast_location(room, location) do
    Agent.get(room, fn set -> set end)
    |> Enum.each(fn user_id ->
      Backend.Socket.Agent.send_info(user_id, {:location, user_id, location})
    end)
  end
end
