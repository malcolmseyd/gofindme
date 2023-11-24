defmodule Backend.Room.Supervisor do
  use DynamicSupervisor

  def start_link(initial_value) do
    DynamicSupervisor.start_link(__MODULE__, initial_value, name: __MODULE__)
  end

  @impl true
  def init(_initial_value) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def create_room() do
    DynamicSupervisor.start_child(__MODULE__, Backend.Room.Agent)
  end
end
