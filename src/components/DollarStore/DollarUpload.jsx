
import { Link } from 'react-router-dom'

const DollarUpload = () => {
  return (
    <div className='flex justify-center gap-6 mb-6 mt-6'>
<Link to={"/2$-upload"} className="bg-green-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition">2$ Upload</Link>   
<Link to={"/5$-upload"} className="bg-green-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-800 transition">5$ Upload</Link>   
    
    </div>
  )
}

export default DollarUpload
