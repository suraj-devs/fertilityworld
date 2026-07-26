// import React from 'react'
import { TrophyStar, Group, BadgeCheck } from '@boxicons/react';

const HomeStrip = () => {
  return (
    <>
    <section className="HomeStrip position-relative" style={{marginTop:"-30px"}}>
        <div className="container">
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 mb-3 border rounded-3 bg-white">
                <div className="col">
                    <div className="d-flex align-items-start gap-2 p-2">
                        <div className="icon"><TrophyStar size="md" fill="rgb(var(--color-primary-green))" /></div>
                        <div className="content">
                            <span>Advanced <span className="d-block"></span> Technology</span>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="d-flex align-items-start gap-2 p-2">
                        <div className="icon"><Group size="md" fill="rgb(var(--color-primary-green))" /></div>
                        <div className="content">
                            <span>Experienced<span className="d-block"></span> Doctors</span>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="d-flex align-items-start gap-2 p-2">
                        <div className="icon"><BadgeCheck size="md" fill="rgb(var(--color-primary-green))" /></div>
                        <div className="content">
                            <span>Personalised <span className="d-block"></span>Care</span>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="d-flex align-items-start gap-2 p-2">
                        <div className="icon"><BadgeCheck size="md" fill="rgb(var(--color-primary-green))" /></div>
                        <div className="content">
                            <span>Global <span className="d-block"></span>Standards</span>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="d-flex align-items-start gap-2 p-2">
                        <div className="icon"><BadgeCheck size="md" fill="rgb(var(--color-primary-green))" /></div>
                        <div className="content">
                            <span>Complete<span className="d-block"></span> Support</span>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="d-flex align-items-start gap-2 p-2">
                        <div className="icon"><BadgeCheck size="md" fill="rgb(var(--color-primary-green))" /></div>
                        <div className="content">
                            <span>Affordable<span className="d-block"></span> Treatment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}
export default HomeStrip
