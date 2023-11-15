defmodule Backend.Socket.Agent do
  use Agent

  def start_link(_initial_value) do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def add(user_id, pid) do
    Agent.update(__MODULE__, &Map.put(&1, user_id, pid))
  end

  def remove(user_id) do
    Agent.update(__MODULE__, &Map.delete(&1, user_id))
  end

  def send_info(user_id, message) do
    pid = Agent.get(__MODULE__, &Map.get(&1, user_id))
    send(pid, message)
  end
end
