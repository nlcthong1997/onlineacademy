module.exports = {
  sevenEarlierDayToCurrent: () => {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    
    const sevenEarlierDay = new Date();
    sevenEarlierDay.setDate(today.getDate - 7);
    const edd = sevenEarlierDay.getDate();
    const emm = sevenEarlierDay.getMonth() + 1;
    const eyyyy = sevenEarlierDay.getFullYear();

    return [eyyyy+'-'+emm+'-'+edd, yyyy+'-'+mm+'-'+dd]
  }
}