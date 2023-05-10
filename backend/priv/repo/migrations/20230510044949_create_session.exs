defmodule Backend.Repo.Migrations.CreateSession do
  use Ecto.Migration

  def change do
    create table(:session) do
      add :token, :binary_id, primary_key: true
    end
  end
end
