defmodule Backend.Schema.Session do
  use Ecto.Schema
  import Ecto.Changeset
  alias Ecto.UUID

  schema "session" do
    field(:token, :binary_id, primary_key: true)
  end

  def changeset(session, attrs) do
    session
    |> cast(attrs, [:token])
    |> put_change(:token, UUID.generate())
    |> validate_required([:token])
  end
end
