export const formatDate = (dateStr) => {
//KUNKANYA: change DateTimeFormat("fr") to DateTimeFormat("en") to 
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
  //console.log(mo)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  const dateString = `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
  }
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}