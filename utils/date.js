module.exports = {
  sevenEarlierDayToCurrent: () => {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    
    const sevenEarlierDay = new Date();
    sevenEarlierDay.setDate(today.getDate() - 7);
    const eDd = sevenEarlierDay.getDate();
    const eMm = sevenEarlierDay.getMonth() + 1;
    const eYyyy = sevenEarlierDay.getFullYear();

    return [eYyyy+'-'+eMm+'-'+eDd, yyyy+'-'+mm+'-'+dd]
  }
}