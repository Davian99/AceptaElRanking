const constructRow = row => {
  return `<tr>
  <td class="user" style="padding: 8px;text-align: center;vertical-align: middle;border: 1px solid #ddd;">
    ${row.user}
  </td>
  <td class="solved" style="padding: 8px;text-align: center;vertical-align: middle;border: 1px solid #ddd;">
    ${row.count}
  </td>
</tr>`;
}

const getTableFromArray = arr => {
  const cols = `<colgroup>
  <col class="user" style="width: 8em;">
  <col class="solved" style="width: 5.5em;">
</colgroup>`;

  const table_head =`<thead>
  <tr style="padding: 8px;line-height: 1.428571429;background-color: #446e9b;background-image: linear-gradient(#6d94bf,#446e9b 50%,#3e648d);background-repeat: no-repeat;filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff6d94bf', endColorstr='#ff3e648d', GradientType=0);filter: none;border: 1px solid #345578;color: #fff;text-align: center;font-weight: 400;vertical-align: middle;">
    <th style="padding: 8px;">User</th>
    <th style="padding: 8px;">Solved</th>
  </tr>
</thead>`;
  
  const table_body = `<tbody style="font-size: 14px;line-height: 1.428571429;color: #2d2d2d;">
    ${arr.map(row => constructRow(row))}
</tbody>`.replace(/,/g, '\n');

  return `<div style="font-size: 14px;">
  <table id="my_table" style="border-collapse: collapse;border-spacing: 0;border: 1px solid #ddd">
    ${cols}
    ${table_head}
    ${table_body}
  </table>
</div>`;
};

module.exports = {getTableFromArray}