defmodule Backend.Matchmaking do
  use GenServer
  require Logger
  import Ecto.Query, only: [from: 2]
  alias Backend.Repo
  alias Backend.Room
  alias Backend.Schema.Queuing
  alias Backend.Socket

  @sleep_interval 5000

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  @impl true
  def init(:ok) do
    schedule_work()
    {:ok, []}
  end

  @impl true
  def handle_info(:work, state) do
    sessions =
      from(q in Queuing,
        select: q,
        limit: 2
      )
      |> Repo.all()

    if length(sessions) === 2 do
      inactive =
        sessions
        |> Enum.map(fn x -> x.session_id end)
        |> Socket.Agent.inactive_sessions()

      if length(inactive) !== 0 do
        from(q in Queuing,
          select: q,
          where: q.session_id in ^inactive
        )
        |> Repo.delete_all()
      else
        [first, second] = sessions
        make_match(first.session_id, second.session_id)

        from(q in Queuing,
          select: q,
          where: q.id in ^[first.id, second.id]
        )
        |> Repo.delete_all()
      end

      handle_info(:work, state)
    else
      schedule_work()
      {:noreply, state}
    end
  end

  defp schedule_work do
    Process.send_after(self(), :work, @sleep_interval)
  end

  defp make_match(first_id, second_id) do
    Logger.debug("Matching #{inspect(first_id)} with #{inspect(second_id)}")
    {:ok, room} = Room.Supervisor.create_room()

    Room.Agent.join_room(room, first_id)
    Room.Agent.join_room(room, second_id)

    :ok = Socket.Agent.send_info(first_id, {:paired, room, second_id})
    :ok = Socket.Agent.send_info(second_id, {:paired, room, first_id})
  end
end
