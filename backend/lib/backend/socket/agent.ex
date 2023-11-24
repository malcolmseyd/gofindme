defmodule Backend.Socket.Agent do
  use Agent

  def start_link(_initial_value) do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def add(session_id, pid) do
    Agent.update(__MODULE__, &Map.put(&1, session_id, pid))
  end

  def remove(session_id) do
    Agent.update(__MODULE__, &Map.delete(&1, session_id))
  end

  def send_info(session_id, message) do
    with {:ok, pid} <- Agent.get(__MODULE__, &Map.fetch(&1, session_id)) do
      send(pid, message)
      :ok
    end
  end

  def inactive_sessions(ids) do
    Agent.get(__MODULE__, fn map ->
      Enum.filter(ids, fn id -> not Map.has_key?(map, id) end)
    end)
  end
end
