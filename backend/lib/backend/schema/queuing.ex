defmodule Backend.Schema.Queuing do
  use Ecto.Schema
  import Ecto.Changeset

  schema "queuing" do
    field(:latitude, :float)
    field(:longitude, :float)
    belongs_to(:session, Backend.Schema.Session)
  end

  def create_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:latitude, :longitude, :session_id])
    |> validate_required([:latitude, :longitude, :session_id])
    |> assoc_constraint(:session)
  end
end
