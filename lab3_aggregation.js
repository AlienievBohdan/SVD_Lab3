use("hospitalsDB")

db.hospitals.aggregate([
  { $count: "total_documents" },
  { $out: "v1_step1_count" }
]);
db.v1_step1_count.find()

db.hospitals.aggregate([
  { $group: { _id: null, total_Average_Covered_Charges: { $sum: "$Average_Covered_Charges" } } },
  { $out: "v1_step2_total_sum" }
]);
db.v1_step2_total_sum.find()

db.hospitals.aggregate([
  { $group: { _id: "$Provider_State", total_Average_Covered_Charges: { $sum: "$Average_Covered_Charges" } } },
  { $sort: { total_Average_Covered_Charges: -1 } },
  { $out: "v1_step3_sum_by_state" }
]);
db.v1_step3_sum_by_state.countDocuments()
db.v1_step3_sum_by_state.find().sort({ total_Average_Covered_Charges: -1 })

const threshold = 200000000
db.hospitals.aggregate([
  { $group: { _id: "$Provider_State", total_Average_Covered_Charges: { $sum: "$Average_Covered_Charges" } } },
  { $match: { total_Average_Covered_Charges: { $gt: threshold } } },
  { $sort: { total_Average_Covered_Charges: -1 } },
  { $out: "v1_step4_states_over_threshold" }
]);
db.v1_step4_states_over_threshold.find().sort({ total_Average_Covered_Charges: -1 })

db.hospitals.countDocuments({ Total_Discharges: { $gt: 20 } })
db.hospitals.aggregate([
  { $match: { Total_Discharges: { $gt: 20 } } },
  { $group: { _id: "$Provider_State", total_Average_Covered_Charges: { $sum: "$Average_Covered_Charges" } } },
  { $match: { total_Average_Covered_Charges: { $gt: threshold } } },
  { $sort: { total_Average_Covered_Charges: -1 } },
  { $out: "v1_step5_filtered_states" }
]);
db.v1_step5_filtered_states.find().sort({ total_Average_Covered_Charges: -1 })
