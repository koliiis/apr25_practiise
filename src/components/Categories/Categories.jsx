import categoriesFromServer from '../../api/categories';
import cn from 'classnames';

export const Categories = ({ selectedCategory, setselectedCategory }) => {
  return (
    <>
      <a
        href="#/"
        data-cy="AllCategories"
        className={cn('button', 'is-success', 'mr-6', {
          'is-outlined': selectedCategory.length > 0,
        })}
        onClick={e => {
          e.preventDefault();
          setselectedCategory([]);
        }}
      >
        All
      </a>

      {categoriesFromServer.map(category => {
        return (
          <a
            key={category.id}
            data-cy="Category"
            className={cn('button', 'mr-2', 'my-1', {
              'is-info': selectedCategory.includes(category.id),
            })}
            href="#/"
            onClick={e => {
              e.preventDefault();
              setselectedCategory(prev => {
                if (prev.includes(category.id)) {
                  return prev.filter(id => id !== category.id);
                }

                return [...prev, category.id];
              });
            }}
          >
            {category.title}
          </a>
        );
      })}
    </>
  );
};
