import React from 'react';

function Tags(props) {
    return (
        <div className="tags-wrapper">
            <div className="tags-container">
                {props.tags.map(tag => {
                    return <span className="tag" onClick={() => { props.handleFilter(tag) }
                    }>{tag} </span>
                })}
            </div>
            <button className="reset-button" onClick={() => { props.handleReset() }} disabled={props.filteredNotes.length > 0 ? false : true}>Clear filters</button>
        </div>
    )
}

export default Tags;
