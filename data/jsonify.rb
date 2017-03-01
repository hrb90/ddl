require 'json'
require 'csv'
require 'byebug'

def transform_player_season(row)
  row = row.to_hash
  new_row = {}
  # Extract player ID
  new_row["playerId"] = row["Player"].split("\\")[1]
  new_row["age"] = row["Age"].to_i
  new_row["team"] = row["Tm"]
  # Only take primary position
  new_row["position"] = row["Pos"].split("-")[0]
  new_row["minutes"] = row["MP"].to_i
  new_row["tsPct"] = row["TS%"].to_f
  new_row["oRbPct"] = row["ORB%"].to_f
  new_row["dRbPct"] = row["DRB%"].to_f
  new_row["tRbPct"] = row["TRB%"].to_f
  new_row["astPct"] = row["AST%"].to_f
  new_row["stlPct"] = row["STL%"].to_f
  new_row["blkPct"] = row["BLK%"].to_f
  new_row["tovPct"] = row["TOV%"].to_f
  new_row["usgPct"] = row["USG%"].to_f
  new_row["obpm"] = row["OBPM"].to_f
  new_row["dbpm"] = row["DBPM"].to_f
  new_row["bpm"] = row["BPM"].to_f
  new_row
end

# Get the data from the csvs
File.open('./csvs/2017_ADV.csv', 'r') do |datafile|
  adv_csv = CSV.new(datafile, headers: true)
  anuhliticks = adv_csv.to_a.map { |row| transform_player_season(row) } # They're bullcrap, Erneh.

  File.open('./all_data.json', 'w') do |f|
    f.puts(anuhliticks.to_json)
  end
end
