import axios from 'axios';
import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

const OwnerItemCard = ({data}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleDeleteItem = async () => {
    try {
        const result = await axios.delete(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true})
        dispatch(setMyShopData(result.data))
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className='w-full flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d]  max-w-2xl'>
        <div className='w-36 h-36 flex-shrink-0 bg-gray-50'>
            <img src={data.image} alt="" className='w-full h-full object-cover' />
        </div>

        <div className='flex flex-col justify-between p-3 flex-1'>
            <div >
                <h2 className='text-base font-semibold text-[#ff4d2d]'>{data.name}</h2>
                <p><span className='font-medium text-gray-70'>Category:</span> {data.category}</p>
                <p><span className='font-medium text-gray-70'>Foof Type:</span> {data.foodType}</p>
                <div className='flex items-center justify-between'>
                    <div className='text-[#ff4d2d] font-bold'>Price: {data.price}</div>
                    
                    <div className='flex items-center gap-2'>
                        <div className='p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]'
                        onClick={() => navigate(`/edit-item/${data._id}`)}
                        >
                          <FaPen size={16}/>
                        </div>

                        <div className='p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]'
                        onClick={handleDeleteItem}
                        >
                            <FaRegTrashAlt size={16}/>
                        </div>
                        
                        
                    </div>
                    
                   
                </div>

            </div>
        </div>
    </div>
  )
}

export default OwnerItemCard