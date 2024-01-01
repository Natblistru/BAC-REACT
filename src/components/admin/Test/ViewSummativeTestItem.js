import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { debounce } from "lodash"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Paginator from '../Paginator';

const SORT_ASC = "asc"
const SORT_DESC = "desc"
const PER_PAGE_OPTIONS = [5,10,20,50,100]

const TableHeader = ({ columns, handleSort, sortColumn, sortOrder}) => {
  return (
    <thead key={`${sortColumn}_${sortOrder}`}>
      <tr>
        {columns.map((column) => (
          <th key={column} onClick={(e) => handleSort(column)}>
            {column.toUpperCase().replace("_", " ")}
            {column === sortColumn ? (
              <span>
                {sortOrder === SORT_ASC ? (
                  <i className="ms-1 fa fa-arrow-up" aria-hidden="true"></i>
                ) : (
                  <i className="ms-1 fa fa-arrow-down" aria-hidden="true"></i>
                )}
              </span>
            ): null}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const DynamicTable = ({ data, columns, commonColumns, loading }) => {
  const getValue = (item, column) => {
    if (commonColumns[column]) {
      return commonColumns[column](item);
    }

    const keys = column.split('.');
    let value = item;

    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        value = '';
        break;
      }
    }

    return value;
  };

  return (
    <tbody>
    {!loading ? (
      data.map((item, index) => (
        <tr key={index}>
          {columns.map((column) => (
            <td key={column}>{getValue(item, column)}</td>
          ))}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={columns.length + 1}>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </td>
      </tr>
    )}
  </tbody>
  );
};

function ViewSummativeTestItem() {

  const [loading, setLoading] = useState(true);
  const [teacherTopicList, setTeacherTopicList] = useState([]);

  const columns_header = ["ID", "Order",        "Task", "Type", "Test Summative","Topic", "Edit",     "Status"];
  const columns =        ['id', 'order_number', 'task', 'type', 'title',          'name', 'editLink', 'status'];
  const mapReactColumnToDBColumn = (reactColumnName) => {
    const columnMap = {
      'ID': 'id',
      'Order': 'order_number',
      'Task': 'task',
      'Type': 'type',
      'Test Summative': 'title',
      'Topic': 'name',
      'Status': 'status',
    };
  
    return columnMap[reactColumnName] || reactColumnName;
  };
  
  const [sortColumn, setSortColumn] = useState(columns[0]);
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [search, setSearch] = useState("")
  const [perPage, setPerPage] = useState(10)
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [blockFilterVisible, setBlockFilterVisible] = useState(false);
  const [learningProgramList, setLearningProgramList] = useState([]);
  const [themeList, setThemeList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder((currentSortOrder) => (currentSortOrder === SORT_ASC ? SORT_DESC : SORT_ASC));
    } else {
      setSortColumn(column);
      setSortOrder(SORT_ASC);
    }
  };

  const handleSearch = useRef(
    debounce((query) => {
        setSearch(query)
        setCurrentPage(1)
        setSortOrder(SORT_ASC)
        setSortColumn(columns[0])
    }, 500)
  ).current

  const handlePerPage = (perPage) => {
    setCurrentPage(1)
    setPerPage(perPage)
  }

  const toggleblockVisible = () => {
    setBlockFilterVisible(!blockFilterVisible);
  };

  const [filter, setFilter] = useState({
    learning_program_id: '',
    theme_learning_program_id: '',
    teacher_id: '',
  })

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
  
    setFilter((prevFilter) => {
      const updatedFilter = { ...prevFilter };
  
      if (name === 'learning_program_id') {
        updatedFilter[name] = value;
        updatedFilter.theme_learning_program_id = '';
      } else {
        updatedFilter[name] = value;
      }
  
      return updatedFilter;
    });
  };
  

  useEffect(() => {

    axios.get('http://localhost:8000/api/all-learningPrograms').then(res=>{
      if(res.data.status === 200){
        setLearningProgramList(res.data.learningProgram);
      }
    });

    axios.get('http://localhost:8000/api/all-themeLearningPrograms').then(res=>{
      if(res.data.status === 200){
        setThemeList(res.data.theme);
      }
    });

    axios.get('http://localhost:8000/api/all-teachers').then(res=>{
      if(res.data.status === 200){
        setTeacherList(res.data.teachers);
      }
    });

  },[])

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const params = {
          search,
          sortColumn: mapReactColumnToDBColumn(sortColumn),
          sortOrder: sortOrder,
          perPage: perPage,
          page: currentPage,
          filterProgram: filter.learning_program_id,
          filterTheme: filter.theme_learning_program_id,
          filterTeacher: filter.teacher_id,
        };
        const response = await axios.get('http://localhost:8000/api/view-summative-test-item', { params });
          if (response.data.status === 200) {
            console.log(response.data)
            setTeacherTopicList(response.data.summativeTestItem);
            setPagination(response.data.pagination)
        }
          setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, [sortColumn, sortOrder, search, perPage, currentPage, filter ]);

  const commonColumns = {
    'editLink': (item) => (
      <Link to={`/admin/edit-summative-test-item/${item.id}`} className="btnBts btn-success btn-small">
        Edit
      </Link>
    ),
    'status': (item) => (item.status === 0 ? 'Shown' : 'Hidden'),
  };

  return (
    <div className="containerBts px-4">
      <div className="cardBts mt-4">
      <div className="card-title m-3">
        <h2>Summative Test Item List</h2>
      </div>
      <div className="rowBts m-2">

          <div className="col-md-3">
              <div className="input-group">
                  <input
                      className="form-control"
                      placeholder="Search..."
                      type="search"
                      onChange={(e) => handleSearch(e.target.value)}
                  />
              </div>
          </div>
          <div className="col-md-2">
              <div className="input-group">
                  <label className="mt-2 me-2">Per page</label>
                  <select className="form-select" value={perPage} onChange={(e) => handlePerPage(e.target.value)}>
                      {PER_PAGE_OPTIONS.map((perPage) => {
                        return (
                          <option key={perPage}>{perPage}</option>
                        )
                      })}

                  </select>
              </div>
          </div>
          <div className="col-md-4">

          </div>
          <div className="col-md-3">
          <FontAwesomeIcon icon={faFilter} onClick={toggleblockVisible} className="btnBts btn-outline-secondary mt-1"/>
          <Link to="/admin/add-summative-test-item" className="btnBts btn-primary text-white float-end">Add Summative Test Items</Link>
          </div>
        </div>
        {blockFilterVisible && 
          <div className="rowBts m-2">
            <div className="col-md-4">
                <div className="form-group">
                  <select name="learning_program_id" onChange={handleInput} value={filter.learning_program_id} className="form-control">  
                    <option value="">Select program</option>
                    {
                      learningProgramList.map((item)=> {
                        return (
                          <option value={item.id} key={item.id}>{item.name}</option>
                        )
                      })
                    }
                  </select>            
                </div>
            </div>
            <div className="col-md-4">          
                <div className="form-group">
                  <select name="theme_learning_program_id" onChange={handleInput} value={filter.theme_learning_program_id} className="form-control">  
                    <option option value="">Select Theme</option>
                    {themeList
                      .filter((item) => item.learning_program_id == filter.learning_program_id)
                      .map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                    ))}
                  </select>            
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <select name="teacher_id" onChange={handleInput} value={filter.teacher_id} className="form-control">  
                    <option option value="">Select Teacher</option>
                    {
                      teacherList.map((item)=> {
                        return (
                          <option value={item.id} key={item.id}>{item.name}</option>
                        )
                      })
                    }
                  </select>            
                </div>
              </div> 

          </div>
        }
        <div className="card-body">
        <table className={`table table-primary table-bordered table-responsive table-striped ${teacherTopicList.length == 0 ? 'table-fixed' : ''}`}>
            <TableHeader
              columns={columns_header}
              handleSort={handleSort}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
            />
            <DynamicTable data={teacherTopicList} columns={columns} commonColumns={commonColumns} loading={loading}/>
          </table>
        </div>
        {teacherTopicList.length > 0 && !loading ? (
                <div className="mt-2">
                    <Paginator
                        pagination={pagination}
                        pageChanged={(page) => setCurrentPage(page)}
                        totalItems={teacherTopicList.length}
                    />
                </div>
            ) : null}
      </div>
    </div>
  );
}
export default ViewSummativeTestItem;