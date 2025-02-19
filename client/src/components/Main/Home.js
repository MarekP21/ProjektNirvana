import React from "react";
import './home.css';// Import stylu CSS

const Home = ({ user }) => {
    return (
        <div className="container">
            <section className="description">
                <p>Nirvana is an American rock band that was found in 1987 in Aberdeen, Washington. The group gained enormous popularity in the 1990s, and its music is described as grunge. The band consisted of Kurt Cobain (vocals and guitar), Krist Novoselic (bass) and Dave Grohl (drums). Prior to Dave joining the band, Aaron Burckhard, Dave Foster, Dan Peters and Chad Channing also played drums. With Chad, Nirvana recorded its extraordinary debut album "Bleach".</p>
                <p>In addition to "Bleach", Nirvana released three more studio albums: "Nevermind", "Incesticide" and "In Utero". The greatest commercial success was the album "Nevermind" from 1991, which sold over 30 million copies worldwide. This album features one of Nirvana's most recognizable songs - "Smells Like Teen Spirit". All albums stood out for their originality, both in terms of composition and lyrics. They show a lot of experimentation and fun with music, which is greatly appreciated by millions of listeners around the world.</p>
                <p>Nirvana's music is characterized by melodic vocal parts, dynamic guitar riffs and intense drum parts. Kurt combined melodic pop sounds with punk-rock brutality. The lyrics of the songs often touch on topics related to depression, alienation and emotional pain. You can find a lot of references to pop culture and artists important to Cobain, e.g. in the songs "Aero Zeppelin" or "Frances Farmer Will Have Her Revenge On Seattle".</p>
                <p>Nirvana made people more aware of the whole new music genre that became grunge. Thanks to "Nevermind" reaching number 1 on the Billboard 200, more people became interested in bands such as Alice in Chains, Pearl Jam, Stone Temple Pilots, and Soundgarden. This is original music, expressing unimaginable emotions and allowing you to break away from life in the most difficult moments. Nirvana's music has changed many lives and continues to do so, giving new generations of listeners a wealth of emotions, just as it does to me.</p>
                <p>Kurt Cobain, the band's leader, died tragically in 1994 at the age of 27. After the breakup of Nirvana, Krist Novoselic became involved in political activities and organized various musical events. Dave Grohl, together with Pat Smear (Nirvana's second guitarist, hired shortly before the band's breakup), found the band Foo Fighters, which continues to enjoy great recognition and popularity. Despite their short career, Nirvana remains one of the most important and influential bands in music history.</p>
            </section>
            <section className="favourite">
                <h3>My current TOP 10 songs:</h3>
                    <ul class="list_fav">
                        <li> <a href="https://www.youtube.com/watch?v=jJs0hg0nNKI"> 1.  Swap Meet </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=QECJ9pCyhns"> 2.  Sliver </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=dUb69RIqfO8"> 3.  Drain You </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=jOg8IblMNK4"> 4.  Sappy </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=pkcJEvMcnEg"> 5.  Lithium </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=qv96yJYhk3M"> 6.  You Know You're right </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=aIr_IXXLZ8Q"> 7.  Aneurysm </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=Q2m3_wCJFYk"> 8.  Dumb </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=ZDY1bl9EWxo"> 9.  Pennyroyal Tea </a></li>
                        <li> <a href="https://www.youtube.com/watch?v=4TsqlT0rfJI"> 10. Rape Me </a></li>
                    </ul>
            </section>
            <footer>
                &copy; 2024 A few words about Nirvana
            </footer>
        </div>
    );
};

export default Home;