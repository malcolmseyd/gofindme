defmodule Backend.Repo.Migrations.CreateSession do
  use Ecto.Migration

  def change do
    create table("session") do
      add :token, :uuid, null: false, default: fragment("gen_random_uuid()")
      add :name, :string, null: false
    end

    create index("session", [:token], unique: true)
  end
end
