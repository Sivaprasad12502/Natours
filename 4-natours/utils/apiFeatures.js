class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
    filter() {
      const queryObj = { ...this.queryString };
      const excludesFields = ['page', 'sort', 'limit', 'fields'];
      excludesFields.forEach((el) => delete queryObj[el]);
      //1b) Advanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      // console.log(JSON.parse(queryStr));
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
    sort() {
      if (this.queryString.sort) {
        // console.log(this.queryString.sort)
        const sortBy = this.queryString.sort.split(',').join(' ');
        // console.log(sortBy);
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
    paginate() {
      let page = this.queryString.page * 1 || 1;
      let limit = this.queryString.limit * 1 || 100;
      let skip = (page - 1) * limit;
      // page=2&limit=10,1-10,page 1,11-20,page 2,21-30 page 3
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }

  module.exports=APIFeatures