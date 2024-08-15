import React from 'react'
import './Programs.css'
import program_1 from '../../assets/program-1.png'
import program_2 from '../../assets/program-2.png'
import program_3 from '../../assets/program-3.png'
import program_icon_1 from '../../assets/program-icon-1.png'
import program_icon_2 from '../../assets/program-icon-2.png'
import program_icon_3 from '../../assets/program-icon-3.png'
const Programs = () => {
  return (
    <div className='programs' >
        <div className='program'>
            <img src="https://images.meesho.com/images/products/370832094/ty07u_512.webp" alt="" className='image' />
            <div className="caption">
              <img src="https://bolt-gcdn.sc-cdn.net/3/lBMdapFwlewbSjJqoX9dr?bo=EhgaABoAMgF9OgEEQgYIqOCXjQZIAlASYAE%3D&uc=18" alt="" />
              <p>Baba Deep Singh Ji</p>
            </div>
        </div>
        <div className='program'>
               <img src="https://mail.satyaagrah.com/images/2022/June/bahadur9juneP.jpg" alt="" className='image' />
               <div className="caption">
              <img src="https://images.dwncdn.net/images/t_app-icon-l/p/7153f2e3-1f9f-4aa4-b6bd-97920cb0f44e/835209373/2095_4-78399926-imgingest-6952175271399646286.png" alt="" />
              <p>Baba Deep Singh Ji</p>
            </div>
        </div>
        <div className='program'>
            <img src="https://www.boloji.com/articlephotos/a51838-2.jpg" alt="" className='image' />
            <div className="caption">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9YtikCE4WO_YQXqB0-UcgSt5F1hDBDTA01g&usqp=CAU" alt="" />
              <p>Bhai Taaru Singh Ji </p>
            </div>
        </div>
        
        
    </div>
  )
}

export default Programs