defmodule Backend.Schema.Session do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :id, autogenerate: true}
  @foreign_key_type :id

  schema "session" do
    field(:token, Ecto.UUID)
    field(:name, :string)
  end

  @spec create_changeset(%{name: :string}) :: Ecto.Changeset.t()
  def create_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
