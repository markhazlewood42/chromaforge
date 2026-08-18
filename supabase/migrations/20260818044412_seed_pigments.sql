-- Starter pigment reference set (see src/engine/pigments.md for sourcing notes).
-- masstone_hex/tinting_strength for these rows are marked is_approx = true where they were
-- not pulled from a specific brand citation and still need verification against real swatches.

insert into pigments (ci_code, common_name, category, masstone_hex, opacity, tinting_strength, is_approx, source_notes) values
  ('PW6',    'Titanium White',            'white',  '#FFFFFF', 'opaque',            'very high', false, 'Gamblin conservation colors chart'),
  ('PBk9',   'Ivory Black',                'black',  '#2B2320', 'semi-opaque',       'medium',    true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PY35',   'Cadmium Yellow Light',       'yellow', '#FFF347', 'opaque',            'high',      true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PY37',   'Cadmium Yellow Medium',      'yellow', '#FFD500', 'opaque',            'high',      true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PY43',   'Yellow Ochre',                'yellow', '#C89935', 'semi-opaque',       'medium',    true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PY42',   'Transparent Mars Yellow',     'yellow', '#C68A2E', 'transparent',       'medium',    true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PO20',   'Cadmium Orange',              'orange', '#FF7F1A', 'opaque',            'high',      true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PR108',  'Cadmium Red Medium',          'red',    '#E2231A', 'opaque',            'high',      true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PR101',  'Mars/Venetian Red',           'red',    '#8B2E1F', 'semi-opaque',       'medium',    true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PBr7-burnt', 'Burnt Sienna',            'brown',  '#8A3324', 'semi-transparent',  'medium',    true,  'Gamblin conservation colors chart; hex/tinting approx (PBr7)'),
  ('PBr7-raw',   'Raw Umber',               'brown',  '#5C4A3A', 'semi-transparent',  'low',       true,  'Gamblin conservation colors chart; hex/tinting approx (PBr7)'),
  ('PV19',   'Quinacridone Red',            'red',    '#A8203F', 'transparent',       'high',      true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PV23',   'Dioxazine Purple',            'violet', '#3C1F5E', 'transparent',       'very high', true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PB29',   'Ultramarine Blue',            'blue',   '#2B2CA3', 'transparent',       'medium',    true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PB28',   'Cobalt Blue',                 'blue',   '#0047AB', 'semi-transparent',  'medium',    true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PB15:2', 'Phthalo Blue',                'blue',   '#0C2340', 'transparent',       'very high', true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PG7',    'Phthalo Green',               'green',  '#123524', 'transparent',       'very high', true,  'Gamblin conservation colors chart; hex/tinting approx'),
  ('PG18',   'Viridian',                    'green',  '#00693E', 'semi-transparent',  'medium',    true,  'Gamblin conservation colors chart; hex/tinting approx');
