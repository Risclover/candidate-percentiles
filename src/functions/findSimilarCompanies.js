function findSimilarCompanies(candidateCompanyId, companiesData) {
  const candidateCompany = Object.values(companiesData).find(
    (company) => parseInt(company.company_id) === parseInt(candidateCompanyId)
  );

  if (!candidateCompany) {
    return [];
  }

  return companiesData.filter((company) => {
    if (company.company_id === candidateCompanyId) {
      return true;
    }
    const difference = Math.abs(
      candidateCompany.fractal_index - company.fractal_index
    );
    return difference < 0.15;
  });
}

export default findSimilarCompanies;
