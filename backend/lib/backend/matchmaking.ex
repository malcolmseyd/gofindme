defmodule Backend.Matchmaking do
  use GenServer
  require Logger
  import Ecto.Query, only: [from: 2]
  alias Backend.Repo
  alias Backend.Schema.Queuing

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
    pair =
      from(q in Queuing,
        select: q,
        limit: 2
      )
      |> Repo.all()

    if length(pair) == 2 do
      [first, second] = pair

      Logger.debug("Matching #{inspect(first)} with #{inspect(second)}")

      from(q in Queuing,
        select: q,
        where: q.id in ^[first.id, second.id]
      )
      |> Repo.delete_all()

      handle_info(:work, state)
    else
      schedule_work()
      {:noreply, state}
    end
  end

  defp schedule_work do
    Process.send_after(self(), :work, @sleep_interval)
  end
end
