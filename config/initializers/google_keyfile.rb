if ENV['GOOGLE_APPLICATION_CREDENTIALS_JSON']
  keyfile_path = Rails.root.join("tmp", "gcp_keyfile.json")
  File.write(keyfile_path, ENV['GOOGLE_APPLICATION_CREDENTIALS_JSON'])
  ENV['GOOGLE_APPLICATION_CREDENTIALS'] = keyfile_path.to_s
end
