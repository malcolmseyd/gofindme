defmodule Backend.Mock.SocketHandler do
  require Logger
  require Jason.Helpers
  import Jason.Helpers, only: [json_map: 1]

  # https://ninenines.eu/docs/en/cowboy/2.6/manual/cowboy_websocket
  @behaviour :cowboy_websocket

  @impl :cowboy_websocket
  def init(request, state) do
    {:cowboy_websocket, request, state}
  end

  @impl :cowboy_websocket
  def websocket_init(state) do
    # assign the logger metadata from the Plug process
    state
    |> Map.get(:logger_metadata)
    |> Logger.metadata()

    Logger.debug("new websocket connection")

    :timer.send_after(500, :paired)

    json_map(type: "searching")
    |> reply_json(state)
  end

  def websocket_handle({:text, text}, state) do
    with {:ok, json} <- Jason.decode(text) do
      handle_msg(json, state)
    else
      {:error, %Jason.DecodeError{position: pos}} ->
        json_map(error: "Error parsing JSON at position #{pos}")
        |> reply_json(state)
    end
  end

  @impl :cowboy_websocket
  def websocket_handle(frame, state) do
    Logger.debug(unhandled_websocket_frame: frame)
    {:ok, state}
  end

  def websocket_info(:paired, state) do
    # setup mocked location updates
    send(self(), :mock_location)
    ticker_ref = :timer.send_interval(1000, :mock_location)
    state = state |> Map.put(:ticker_ref, ticker_ref)

    json_map(type: "paired", name: "Mr. Mock")
    |> reply_json(state)
  end

  def websocket_info(:mock_location, state) do
    {lat, long} = mock_coords()

    json_map(type: "location_update", lat: lat, long: long)
    |> reply_json(state)
  end

  @impl :cowboy_websocket
  def websocket_info(info, state) do
    Logger.debug(unhandled_websocket_info: info)
    {:ok, state}
  end

  @impl :cowboy_websocket
  def terminate(reason, _partial_req, state) do
    case reason do
      :normal ->
        :ok

      _ ->
        Logger.debug(websocket_terminated: reason)
    end

    %{ticker_ref: ticker_ref} = state
    :timer.cancel(ticker_ref)
    :ok
  end

  defp mock_coords() do
    {lat, long} = {48.463987, -123.303246}
    lat = lat + (:rand.uniform() - 0.5) * 0.01
    long = long + (:rand.uniform() - 0.5) * 0.01
    {lat, long}
  end

  defp reply_text(text, state) do
    {:reply, {:text, text}, state}
  end

  defp reply_json(map, state) do
    map
    |> Jason.encode!()
    |> reply_text(state)
  end

  defp handle_msg(%{"type" => "chat", "msg" => msg}, state) do
    # respond with a timestamped echo
    now = DateTime.utc_now()

    json_map(type: "chat", msg: msg, sent: now)
    |> reply_json(state)
  end

  defp handle_msg(%{"type" => "keep_alive"}, state) do
    Logger.debug(msg: "keep_alive")
    {:ok, state}
  end

  defp handle_msg(%{"type" => "location_update", "lat" => lat, "long" => long}, state) do
    Logger.debug(msg: "location_update", lat: lat, long: long)
    {:ok, state}
  end

  defp handle_msg(msg, state) do
    Logger.debug(unhandled_msg: msg)
    {:ok, state}
  end
end
