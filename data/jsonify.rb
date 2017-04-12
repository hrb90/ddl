require 'json'
require 'csv'
require 'byebug'

def transform_player_adv(row)
  row = row.to_hash
  new_row = {}
  # Extract player ID
  new_row["playerId"] = row["Player"].split("\\")[1]
  new_row["name"] = row["Player"].split("\\")[0]
  new_row["age"] = row["Age"].to_i
  new_row["team"] = row["Tm"]
  # Only take primary position
  new_row["position"] = row["Pos"].split("-")[0]
  new_row["minutes"] = row["MP"].to_i
  new_row["threeRate"] = row["3PAr"].to_f
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

def transform_player_pg(row)
  row = row.to_hash
  new_row = {}
  new_row["playerId"] = row["Player"].split("\\")[1]
  new_row["games"] = row["G"].to_i
  new_row["fgPct"] = row["FG%"].to_f
  new_row["threePct"] = row["3P%"].to_f
  new_row["ftPct"] = row["FT%"].to_f
  new_row["orbPg"] = row["ORB"].to_f
  new_row["drbPg"] = row["DRB"].to_f
  new_row["trbPg"] = row["TRB"].to_f
  new_row["astPg"] = row["AST"].to_f
  new_row["stlPg"] = row["STL"].to_f
  new_row["blkPg"] = row["BLK"].to_f
  new_row["tovPg"] = row["TOV"].to_f
  new_row["ptsPg"] = row["PS/G"].to_f
  new_row
end

def get_data_for_season(year)
  players = {};
  ['ADV', 'PG'].each do |type|
    File.open("./csvs/#{year}_#{type}.csv", 'r') do |datafile|
      csv = CSV.new(datafile, headers: true)
      csv.to_a.each do |row|
        if type == 'ADV'
          data = transform_player_adv(row)
          players[data["playerId"]] = data.merge({season: year})
        else
          data = transform_player_pg(row)
          players[data["playerId"]] = players[data["playerId"]].merge(data)
        end
      end
    end
  end
  players
end

def make_json(years)
  anuhliticks = []  # They're bullcrap, Erneh.

  years.each do |year|
    anuhliticks += get_data_for_season(year).values
  end

  anuhliticks.select! { |player| player["minutes"] >= 100 }

  anuhliticks.to_json
end

File.open('./all_data.json', 'w') do |f|
  f.puts(make_json((1980..2017).to_a))
end

File.open('./placeholder_data.json', 'w') do |f|
  f.puts(make_json((2016..2017).to_a))
end
