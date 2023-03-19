import NoteCard from "./NoteCard"

const Home = ()=>{


    return (
        <div className="flex flex-wrap">
            <section>
                <NoteCard  />
            </section>

            <section>
                <NoteCard  />
            </section>

            <section>
                <NoteCard />
            </section>
            <section>
                <NoteCard />
            </section>
            <section>
                <NoteCard />
            </section>
            
            
        </div>
    )
}

export default Home