function calculatePercentile(candidateId, dataset, scoreType) {
  const candidate = dataset.find(
    (record) => record.candidate_id === candidateId
  );

  if (!candidate) {
    return;
  }

  const filteredData = dataset.filter(
    (record) =>
      record.title === candidate.title &&
      record.company_id === candidate.company_id
  );

  const sortedData = filteredData.sort((a, b) => a[scoreType] - b[scoreType]);

  const candidateRank = sortedData.findIndex(
    (record) => record.candidate_id === candidateId
  );

  const percentile = (candidateRank / (sortedData.length - 1)) * 100;

  return percentile;
}

export default calculatePercentile;
