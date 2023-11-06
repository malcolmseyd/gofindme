defmodule Backend.Repo.Migrations.CreateQueuing do
  use Ecto.Migration

  def change do
    create table("queuing") do
      add :latitude, :float
      add :longitude, :float
      add :session_id, references(:session)
    end
  end
end
